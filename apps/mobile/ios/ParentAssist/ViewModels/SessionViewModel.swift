import Foundation
import SwiftUI

@MainActor
final class SessionViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case preparing
        case sharing(ShareSession)
        case error(String)
    }

    @Published private(set) var state: State = .idle
    @Published var hasAcceptedConsent = false

    private let sessionService: SessionServicing
    private let screenShareController: ScreenShareControlling
    private let webrtcStreamer: WebRTCStreaming

    init(
        sessionService: SessionServicing,
        screenShareController: ScreenShareControlling,
        webrtcStreamer: WebRTCStreaming
    ) {
        self.sessionService = sessionService
        self.screenShareController = screenShareController
        self.webrtcStreamer = webrtcStreamer
    }

    func startSession() {
        guard hasAcceptedConsent else {
            state = .error("Please review and accept the sharing consent.")
            return
        }

        state = .preparing
        Task {
            do {
                let session = try await sessionService.createSession()
                try await webrtcStreamer.connect(sessionId: session.sessionId)
                try await screenShareController.startSharing()
                state = .sharing(session)
            } catch {
                state = .error(error.localizedDescription)
            }
        }
    }

    func stopSession() {
        guard case let .sharing(session) = state else { return }

        Task {
            await webrtcStreamer.disconnect()
            await screenShareController.stopSharing()
            await sessionService.stopSession(session)
            state = .idle
        }
    }

    func resetError() {
        if case .error = state {
            state = .idle
        }
    }
}
