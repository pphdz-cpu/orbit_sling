using UnityEngine;

/// <summary>
/// Player comet: continuous upward thrust, tether input, and release trajectory.
/// Attach to the player prefab with a Rigidbody2D.
/// </summary>
[RequireComponent(typeof(Rigidbody2D))]
public class CometController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float upwardForce = 8f;
    [SerializeField] private float maxSpeed = 18f;
    [SerializeField] private float releaseVelocityMultiplier = 1.15f;

    [Header("Tether")]
    [SerializeField] private LayerMask planetLayerMask = ~0;
    [SerializeField] private float tetherSearchRadius = 6f;
    [SerializeField] private bool useHingeJoint;

    private Rigidbody2D body;
    private Joint2D activeJoint;
    private Planet tetheredPlanet;
    private bool inputHeld;

    public bool IsTethered => activeJoint != null;
    public Planet TetheredPlanet => tetheredPlanet;
    public float CurrentSpeed => body.velocity.magnitude;

    private void Awake()
    {
        body = GetComponent<Rigidbody2D>();
        body.gravityScale = 1f;
        body.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
    }

    private void FixedUpdate()
    {
        if (!IsTethered)
        {
            body.AddForce(Vector2.up * upwardForce, ForceMode2D.Force);
        }

        if (body.velocity.sqrMagnitude > maxSpeed * maxSpeed)
        {
            body.velocity = body.velocity.normalized * maxSpeed;
        }

        if (IsTethered && tetheredPlanet != null &&
            tetheredPlanet.HasExceededBreakDistance(body.position))
        {
            ReleaseTether();
        }
    }

    private void Update()
    {
        inputHeld = GetTetherInputHeld();

        if (inputHeld && !IsTethered)
        {
            TryAttachToNearestPlanet();
        }
        else if (!inputHeld && IsTethered)
        {
            ReleaseTether();
        }
    }

    private bool GetTetherInputHeld()
    {
        if (Input.touchCount > 0)
        {
            return true;
        }

        return Input.GetMouseButton(0) || Input.GetKey(KeyCode.Space);
    }

    private void TryAttachToNearestPlanet()
    {
        Collider2D[] hits = Physics2D.OverlapCircleAll(body.position, tetherSearchRadius, planetLayerMask);
        Planet nearest = null;
        float nearestDistance = float.MaxValue;

        foreach (Collider2D hit in hits)
        {
            Planet planet = hit.GetComponent<Planet>();
            if (planet == null || !planet.IsWithinTetherRange(body.position))
            {
                continue;
            }

            float distance = Vector2.Distance(body.position, planet.AnchorPosition);
            if (distance < nearestDistance)
            {
                nearestDistance = distance;
                nearest = planet;
            }
        }

        if (nearest != null)
        {
            AttachToPlanet(nearest);
        }
    }

    private void AttachToPlanet(Planet planet)
    {
        ReleaseTether();

        tetheredPlanet = planet;

        if (useHingeJoint)
        {
            HingeJoint2D hinge = gameObject.AddComponent<HingeJoint2D>();
            hinge.connectedBody = planet.GetComponent<Rigidbody2D>();
            hinge.autoConfigureConnectedAnchor = false;
            hinge.anchor = transform.InverseTransformPoint(planet.AnchorPosition);
            hinge.connectedAnchor = Vector2.zero;
            activeJoint = hinge;
        }
        else
        {
            DistanceJoint2D distanceJoint = gameObject.AddComponent<DistanceJoint2D>();
            distanceJoint.connectedBody = planet.GetComponent<Rigidbody2D>();
            distanceJoint.autoConfigureConnectedAnchor = false;
            distanceJoint.autoConfigureDistance = false;
            distanceJoint.anchor = transform.InverseTransformPoint(planet.AnchorPosition);
            distanceJoint.connectedAnchor = Vector2.zero;
            distanceJoint.distance = Vector2.Distance(body.position, planet.AnchorPosition);
            activeJoint = distanceJoint;
        }
    }

    private void ReleaseTether()
    {
        if (activeJoint != null)
        {
            Destroy(activeJoint);
            activeJoint = null;
        }

        if (tetheredPlanet != null)
        {
            body.velocity *= releaseVelocityMultiplier;
            tetheredPlanet = null;
        }
    }

    private void OnDisable()
    {
        ReleaseTether();
    }
}
