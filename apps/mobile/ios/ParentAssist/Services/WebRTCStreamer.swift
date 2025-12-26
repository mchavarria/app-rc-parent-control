import Foundation

protocol WebRTCStreaming {
    func connect(sessionId: String) async throws
    func disconnect() async
}

final class WebRTCStreamer: WebRTCStreaming {
    private let signaling: SignalingClient
    private var listenTask: Task<Void, Never>?

    init(signaling: SignalingClient) {
        self.signaling = signaling
    }

    func connect(sessionId: String) async throws {
        try await signaling.connect()
        try await signaling.send(.join(sessionId: sessionId, role: .streamer))
        startListening()
    }

    func disconnect() async {
        listenTask?.cancel()
        listenTask = nil
        signaling.disconnect()
    }

    private func startListening() {
        listenTask?.cancel()
        listenTask = Task {
            while !Task.isCancelled {
                do {
                    _ = try await signaling.receive()
                } catch {
                    break
                }
            }
        }
    }
}
