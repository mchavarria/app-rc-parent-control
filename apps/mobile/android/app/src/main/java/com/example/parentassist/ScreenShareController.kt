package com.example.parentassist

import android.media.projection.MediaProjectionManager

interface ScreenShareController {
    suspend fun startSharing()
    suspend fun stopSharing()
}

class MediaProjectionController : ScreenShareController {
    override suspend fun startSharing() {
        // Placeholder: integrate MediaProjection flow + foreground service.
    }

    override suspend fun stopSharing() {
        // Placeholder: stop MediaProjection capture.
    }
}

class ScreenShareUnavailable : Exception("Screen sharing is not available on this device.")
