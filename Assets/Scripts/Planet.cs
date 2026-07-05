using UnityEngine;

/// <summary>
/// Static anchor for tether joints. Attach to planet prefabs in the scene.
/// </summary>
[RequireComponent(typeof(Rigidbody2D))]
public class Planet : MonoBehaviour
{
    [SerializeField] private float tetherRadius = 2.5f;
    [SerializeField] private float tetherBreakDistance = 4f;

    public float TetherRadius => tetherRadius;
    public float TetherBreakDistance => tetherBreakDistance;

    private Rigidbody2D body;

    private void Awake()
    {
        body = GetComponent<Rigidbody2D>();
        body.bodyType = RigidbodyType2D.Static;
    }

    public bool IsWithinTetherRange(Vector2 position)
    {
        return Vector2.Distance(position, body.position) <= tetherRadius;
    }

    public bool HasExceededBreakDistance(Vector2 position)
    {
        return Vector2.Distance(position, body.position) >= tetherBreakDistance;
    }

    public Vector2 AnchorPosition => body.position;

#if UNITY_EDITOR
    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.cyan;
        Gizmos.DrawWireSphere(transform.position, tetherRadius);

        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, tetherBreakDistance);
    }
#endif
}
