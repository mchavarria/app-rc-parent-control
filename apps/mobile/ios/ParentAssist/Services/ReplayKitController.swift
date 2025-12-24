import Foundation
import ReplayKit

protocol ScreenShareControlling {
    func startSharing() async throws
    func stopSharing() async
}

struct ReplayKitController: ScreenShareControlling {
    func startSharing() async throws {
        guard RPScreenRecorder.shared().isAvailable else {
            throw ScreenShareError.unavailable
        }
        // Placeholder: actual broadcast extension wiring will be added with WebRTC pipeline.
    }

    func stopSharing() async {
        // Placeholder: stop the broadcast session when implemented.
    }
}

enum ScreenShareError: LocalizedError {
    case unavailable
    case failedToStart

    var errorDescription: String? {
        switch self {
        case .unavailable:
            return "Screen sharing is not available on this device."
        case .failedToStart:
            return "Unable to start screen sharing."
        }
    }
}
