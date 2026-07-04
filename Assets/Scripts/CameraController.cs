using UnityEngine;

/// <summary>
/// Orthographic camera that continuously rises on the Y-axis and optionally tracks the comet.
/// </summary>
[RequireComponent(typeof(Camera))]
public class CameraController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float riseSpeed = 2f;
    [SerializeField] private float followSmoothing = 4f;
    [SerializeField] private bool followCometVertically = true;

    [Header("References")]
    [SerializeField] private Transform target;

    public float CurrentY => transform.position.y;

    private Camera cam;
    private float minY;

    private void Awake()
    {
        cam = GetComponent<Camera>();
        cam.orthographic = true;
        minY = transform.position.y;
    }

    private void Start()
    {
        if (target == null)
        {
            CometController comet = FindObjectOfType<CometController>();
            if (comet != null)
            {
                target = comet.transform;
            }
        }
    }

    private void LateUpdate()
    {
        minY += riseSpeed * Time.deltaTime;

        float desiredY = minY;
        if (followCometVertically && target != null)
        {
            desiredY = Mathf.Max(minY, target.position.y);
        }

        Vector3 position = transform.position;
        position.y = Mathf.Lerp(position.y, desiredY, followSmoothing * Time.deltaTime);
        transform.position = position;
    }
}
