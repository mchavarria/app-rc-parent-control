import SwiftUI

@main
struct ParentAssistApp: App {
    @StateObject private var viewModel: SessionViewModel = {
        let config = AppConfig()
        let signaling = WebSocketSignalingClient(url: config.signalingURL)
        let streamer = WebRTCStreamer(signaling: signaling)
        return SessionViewModel(
            sessionService: MockSessionService(),
            screenShareController: ReplayKitController(),
            webrtcStreamer: streamer
        )
    }()

    var body: some Scene {
        WindowGroup {
            RootView(viewModel: viewModel)
        }
    }
}
