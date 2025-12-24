import Foundation

struct ShareSession: Equatable {
    let sessionId: String
    let joinCode: String
    let expiresAt: Date
    let viewerUrl: URL

    var isExpired: Bool {
        Date() >= expiresAt
    }
}
