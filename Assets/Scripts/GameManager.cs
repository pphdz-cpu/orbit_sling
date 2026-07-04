using UnityEngine;
using UnityEngine.Events;
using UnityEngine.SceneManagement;

/// <summary>
/// Tracks score, win/loss, and keeps the comet inside playable bounds.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("References")]
    [SerializeField] private CometController comet;
    [SerializeField] private CameraController cameraController;

    [Header("Boundaries")]
    [SerializeField] private float horizontalBoundary = 8f;
    [SerializeField] private float fallDeathOffset = 6f;
    [SerializeField] private float winAltitude = 500f;

    [Header("Score")]
    [SerializeField] private float scorePerMeter = 1f;

    public UnityEvent<int> onScoreChanged;
    public UnityEvent onGameOver;
    public UnityEvent onWin;

    public int Score { get; private set; }
    public float HighestAltitude { get; private set; }
    public bool IsPlaying { get; private set; } = true;

    private float startAltitude;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;

        if (comet == null)
        {
            comet = FindObjectOfType<CometController>();
        }

        if (cameraController == null)
        {
            cameraController = FindObjectOfType<CameraController>();
        }
    }

    private void Start()
    {
        if (comet != null)
        {
            startAltitude = comet.transform.position.y;
            HighestAltitude = startAltitude;
        }
    }

    private void Update()
    {
        if (!IsPlaying || comet == null)
        {
            return;
        }

        UpdateScore();
        EnforceHorizontalBounds();
        CheckLossConditions();
        CheckWinCondition();
    }

    private void UpdateScore()
    {
        float altitudeGain = Mathf.Max(0f, comet.transform.position.y - startAltitude);
        HighestAltitude = Mathf.Max(HighestAltitude, comet.transform.position.y);

        int newScore = Mathf.FloorToInt(altitudeGain * scorePerMeter);
        if (newScore != Score)
        {
            Score = newScore;
            onScoreChanged?.Invoke(Score);
        }
    }

    private void EnforceHorizontalBounds()
    {
        Vector3 position = comet.transform.position;
        position.x = Mathf.Clamp(position.x, -horizontalBoundary, horizontalBoundary);
        comet.transform.position = position;
    }

    private void CheckLossConditions()
    {
        float cameraY = cameraController != null
            ? cameraController.CurrentY
            : Camera.main != null ? Camera.main.transform.position.y : 0f;

        if (comet.transform.position.y < cameraY - fallDeathOffset)
        {
            EndGame(false);
        }
    }

    private void CheckWinCondition()
    {
        float altitudeGain = comet.transform.position.y - startAltitude;
        if (altitudeGain >= winAltitude)
        {
            EndGame(true);
        }
    }

    public void EndGame(bool won)
    {
        if (!IsPlaying)
        {
            return;
        }

        IsPlaying = false;

        if (won)
        {
            onWin?.Invoke();
        }
        else
        {
            onGameOver?.Invoke();
        }
    }

    public void RestartScene()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
}
