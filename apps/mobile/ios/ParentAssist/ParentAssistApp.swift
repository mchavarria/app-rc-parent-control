import SwiftUI

@main
struct ParentAssistApp: App {
    @StateObject private var viewModel = SessionViewModel(
        sessionService: MockSessionService(),
        screenShareController: ReplayKitController()
    )

    var body: some Scene {
        WindowGroup {
            RootView(viewModel: viewModel)
        }
    }
}
