import SwiftUI

struct StartView: View {
    @ObservedObject var viewModel: SessionViewModel

    var body: some View {
        VStack(spacing: 24) {
            Text("Need Help?")
                .font(.largeTitle.bold())
                .multilineTextAlignment(.center)

            Text("Start a live help session to share your screen with a trusted helper.")
                .font(.title3)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)

            ConsentView(hasAccepted: $viewModel.hasAcceptedConsent)

            if case let .error(message) = viewModel.state {
                Text(message)
                    .foregroundColor(.red)
                    .font(.callout)
            }

            Button(action: viewModel.startSession) {
                HStack {
                    if viewModel.state == .preparing {
                        ProgressView()
                    }
                    Text(viewModel.state == .preparing ? "Starting..." : "Start Help Session")
                        .font(.title2.bold())
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(viewModel.hasAcceptedConsent ? Color.blue : Color.gray)
                .foregroundColor(.white)
                .cornerRadius(16)
            }
            .disabled(!viewModel.hasAcceptedConsent || viewModel.state == .preparing)

            Spacer()
        }
        .padding()
        .onChange(of: viewModel.hasAcceptedConsent) { _ in
            viewModel.resetError()
        }
    }
}
