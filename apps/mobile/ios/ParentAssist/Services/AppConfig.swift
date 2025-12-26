import Foundation

struct AppConfig {
    let signalingURL: URL

    init(signalingURL: URL = AppConfig.resolveSignalingURL()) {
        self.signalingURL = signalingURL
    }

    private static func resolveSignalingURL() -> URL {
        if let envValue = ProcessInfo.processInfo.environment["SIGNALING_URL"],
           let envURL = URL(string: envValue) {
            return envURL
        }

        if let infoValue = Bundle.main.object(forInfoDictionaryKey: "SignalingURL") as? String,
           let infoURL = URL(string: infoValue) {
            return infoURL
        }

        return URL(string: "ws://localhost:8080")!
    }
}
