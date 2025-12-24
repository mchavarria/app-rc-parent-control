package com.example.parentassist

import java.time.Instant

data class ShareSession(
    val sessionId: String,
    val joinCode: String,
    val expiresAt: Instant,
    val viewerUrl: String
) {
    val isExpired: Boolean
        get() = Instant.now().isAfter(expiresAt)
}
