import XCTest
@testable import ParentAssist

@MainActor
final class SessionViewModelTests: XCTestCase {
    func testStartSessionRequiresConsent() {
        let viewModel = SessionViewModel(
            sessionService: StubSessionService(),
            screenShareController: StubScreenShareController()
        )

        viewModel.startSession()

        XCTAssertEqual(viewModel.state, .error("Please review and accept the sharing consent."))
    }

    func testStopSessionReturnsToIdle() async {
        let session = ShareSession(
            sessionId: "id",
            joinCode: "ABC123",
            expiresAt: Date().addingTimeInterval(60),
            viewerUrl: URL(string: "https://example.com")!
        )
        let viewModel = SessionViewModel(
            sessionService: StubSessionService(session: session),
            screenShareController: StubScreenShareController()
        )

        viewModel.hasAcceptedConsent = true
        viewModel.startSession()

        await Task.yield()

        viewModel.stopSession()

        await Task.yield()

        XCTAssertEqual(viewModel.state, .idle)
    }
}

private struct StubSessionService: SessionServicing {
    var session: ShareSession? = nil

    func createSession() async throws -> ShareSession {
        if let session {
            return session
        }

        return ShareSession(
            sessionId: "test",
            joinCode: "AAAAAA",
            expiresAt: Date().addingTimeInterval(60),
            viewerUrl: URL(string: "https://example.com/join/AAAAAA")!
        )
    }

    func stopSession(_ session: ShareSession) async {
        _ = session
    }
}

private struct StubScreenShareController: ScreenShareControlling {
    func startSharing() async throws { }
    func stopSharing() async { }
}
