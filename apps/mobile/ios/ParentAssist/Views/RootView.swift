import SwiftUI

struct RootView: View {
    @ObservedObject var viewModel: SessionViewModel

    var body: some View {
        NavigationStack {
            switch viewModel.state {
            case .idle, .preparing, .error:
                StartView(viewModel: viewModel)
            case .sharing(let session):
                SharingView(viewModel: viewModel, session: session)
            }
        }
    }
}
