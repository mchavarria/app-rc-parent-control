import SwiftUI

struct ConsentView: View {
    @Binding var hasAccepted: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Before you share")
                .font(.headline)

            Text("Your helper will see your screen live. You can stop sharing at any time.")
                .font(.subheadline)
                .foregroundColor(.secondary)

            Toggle("I understand and agree to share my screen", isOn: $hasAccepted)
                .toggleStyle(SwitchToggleStyle(tint: .blue))
        }
        .padding()
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(16)
    }
}
