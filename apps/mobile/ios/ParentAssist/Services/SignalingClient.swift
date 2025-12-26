import Foundation

enum SignalingRole: String {
    case viewer
    case streamer
}

enum SignalingMessage: Codable {
    case join(sessionId: String, role: SignalingRole)
    case ready
    case offer(sdp: String)
    case answer(sdp: String)
    case candidate(candidate: String)
    case error(message: String)

    private enum CodingKeys: String, CodingKey {
        case type
        case sessionId
        case role
        case sdp
        case candidate
        case message
    }

    private enum MessageType: String, Codable {
        case join
        case ready
        case offer
        case answer
        case candidate
        case error
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case let .join(sessionId, role):
            try container.encode(MessageType.join, forKey: .type)
            try container.encode(sessionId, forKey: .sessionId)
            try container.encode(role, forKey: .role)
        case .ready:
            try container.encode(MessageType.ready, forKey: .type)
        case let .offer(sdp):
            try container.encode(MessageType.offer, forKey: .type)
            try container.encode(sdp, forKey: .sdp)
        case let .answer(sdp):
            try container.encode(MessageType.answer, forKey: .type)
            try container.encode(sdp, forKey: .sdp)
        case let .candidate(candidate):
            try container.encode(MessageType.candidate, forKey: .type)
            try container.encode(candidate, forKey: .candidate)
        case let .error(message):
            try container.encode(MessageType.error, forKey: .type)
            try container.encode(message, forKey: .message)
        }
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(MessageType.self, forKey: .type)
        switch type {
        case .join:
            let sessionId = try container.decode(String.self, forKey: .sessionId)
            let role = try container.decode(SignalingRole.self, forKey: .role)
            self = .join(sessionId: sessionId, role: role)
        case .ready:
            self = .ready
        case .offer:
            let sdp = try container.decode(String.self, forKey: .sdp)
            self = .offer(sdp: sdp)
        case .answer:
            let sdp = try container.decode(String.self, forKey: .sdp)
            self = .answer(sdp: sdp)
        case .candidate:
            let candidate = try container.decode(String.self, forKey: .candidate)
            self = .candidate(candidate: candidate)
        case .error:
            let message = try container.decode(String.self, forKey: .message)
            self = .error(message: message)
        }
    }
}

protocol SignalingClient {
    func connect() async throws
    func send(_ message: SignalingMessage) async throws
    func receive() async throws -> SignalingMessage
    func disconnect()
}

final class WebSocketSignalingClient: SignalingClient {
    private let url: URL
    private var task: URLSessionWebSocketTask?

    init(url: URL) {
        self.url = url
    }

    func connect() async throws {
        if task != nil {
            return
        }
        let session = URLSession(configuration: .default)
        let task = session.webSocketTask(with: url)
        self.task = task
        task.resume()
    }

    func send(_ message: SignalingMessage) async throws {
        let data = try JSONEncoder().encode(message)
        let payload = URLSessionWebSocketTask.Message.data(data)
        try await task?.send(payload)
    }

    func receive() async throws -> SignalingMessage {
        guard let message = try await task?.receive() else {
            throw URLError(.badServerResponse)
        }

        switch message {
        case let .data(data):
            return try JSONDecoder().decode(SignalingMessage.self, from: data)
        case let .string(text):
            let data = Data(text.utf8)
            return try JSONDecoder().decode(SignalingMessage.self, from: data)
        @unknown default:
            throw URLError(.cannotParseResponse)
        }
    }

    func disconnect() {
        task?.cancel(with: .goingAway, reason: nil)
        task = nil
    }
}
