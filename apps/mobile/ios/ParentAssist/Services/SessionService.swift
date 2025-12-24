import Foundation

protocol SessionServicing {
    func createSession() async throws -> ShareSession
    func stopSession(_ session: ShareSession) async
}

struct MockSessionService: SessionServicing {
    private let clock: () -> Date

    init(clock: @escaping () -> Date = Date.init) {
        self.clock = clock
    }

    func createSession() async throws -> ShareSession {
        let sessionId = UUID().uuidString
        let joinCode = String(sessionId.prefix(6)).uppercased()
        let expiresAt = clock().addingTimeInterval(60 * 15)
        let url = URL(string: "https://example.com/join/\(joinCode)")!
        return ShareSession(sessionId: sessionId, joinCode: joinCode, expiresAt: expiresAt, viewerUrl: url)
    }

    func stopSession(_ session: ShareSession) async {
        _ = session
    }
}
