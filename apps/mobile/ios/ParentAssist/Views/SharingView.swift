import SwiftUI

struct SharingView: View {
    @ObservedObject var viewModel: SessionViewModel
    let session: ShareSession

    var body: some View {
        VStack(spacing: 20) {
            HStack {
                Text("LIVE")
                    .font(.headline.bold())
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                Spacer()
            }

            Text("You are sharing your screen")
                .font(.title2.bold())
                .multilineTextAlignment(.center)

            VStack(spacing: 8) {
                Text("Join code")
                    .font(.headline)
                Text(session.joinCode)
                    .font(.system(size: 36, weight: .bold, design: .rounded))
                Text("Expires at \(session.expiresAt.formatted(date: .omitted, time: .shortened))")
                    .font(.footnote)
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(UIColor.secondarySystemBackground))
            .cornerRadius(16)

            Button(action: viewModel.stopSession) {
                Text("Stop Sharing")
                    .font(.title2.bold())
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(16)
            }

            Spacer()
        }
        .padding()
    }
}
