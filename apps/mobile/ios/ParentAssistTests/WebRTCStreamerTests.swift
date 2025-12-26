import XCTest
@testable import ParentAssist

final class WebRTCStreamerTests: XCTestCase {
    func testConnectSendsJoin() async throws {
        let mock = MockSignalingClient()
        let streamer = WebRTCStreamer(signaling: mock)

        try await streamer.connect(sessionId: "session-1")

        XCTAssertEqual(mock.sentMessages.count, 1)
        if case let .join(sessionId, role) = mock.sentMessages.first {
            XCTAssertEqual(sessionId, "session-1")
            XCTAssertEqual(role, .streamer)
        } else {
            XCTFail("Expected join message")
        }
    }
}

private final class MockSignalingClient: SignalingClient {
    var sentMessages: [SignalingMessage] = []

    func connect() async throws { }

    func send(_ message: SignalingMessage) async throws {
        sentMessages.append(message)
    }

    func receive() async throws -> SignalingMessage {
        throw URLError(.badServerResponse)
    }

    func disconnect() { }
}
