import XCTest
@testable import ParentAssist

final class SessionServiceTests: XCTestCase {
    func testCreateSessionUsesClockForExpiry() async throws {
        let baseDate = Date(timeIntervalSince1970: 1_700_000_000)
        let service = MockSessionService(clock: { baseDate })

        let session = try await service.createSession()

        XCTAssertEqual(session.expiresAt, baseDate.addingTimeInterval(60 * 15))
        XCTAssertEqual(session.joinCode.count, 6)
        XCTAssertTrue(session.viewerUrl.absoluteString.contains(session.joinCode))
    }
}
