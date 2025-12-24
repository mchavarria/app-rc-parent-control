package com.example.parentassist

import android.content.Context

interface ScreenShareController {
    suspend fun startSharing()
    suspend fun stopSharing()
}

class MediaProjectionController(private val context: Context) : ScreenShareController {
    override suspend fun startSharing() {
        // Placeholder: integrate MediaProjection flow + foreground service.
        ForegroundCaptureService.start(context)
    }

    override suspend fun stopSharing() {
        // Placeholder: stop MediaProjection capture.
        ForegroundCaptureService.stop(context)
    }
}

class ScreenShareUnavailable : Exception("Screen sharing is not available on this device.")
