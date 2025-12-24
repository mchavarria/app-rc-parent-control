# iOS Sender App

This folder contains the SwiftUI sender app scaffolded via XcodeGen.

## Generate Xcode project

```sh
xcodegen generate
```

Then open `ParentAssist.xcodeproj` in Xcode.

## Run
- Select `ParentAssist` scheme.
- Build/run on a simulator or device.

## Notes
- ReplayKit streaming is stubbed behind a protocol. This keeps the UI/testable logic in place while signaling/WebRTC are wired up.
