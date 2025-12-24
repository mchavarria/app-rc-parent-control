package com.example.parentassist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed class SessionState {
    data object Idle : SessionState()
    data object Preparing : SessionState()
    data class Sharing(val session: ShareSession) : SessionState()
    data class Error(val message: String) : SessionState()
}

class SessionViewModel(
    private val sessionService: SessionService,
    private val screenShareController: ScreenShareController
) : ViewModel() {
    private val _state = MutableStateFlow<SessionState>(SessionState.Idle)
    val state: StateFlow<SessionState> = _state

    var hasAcceptedConsent: Boolean = false
        private set

    fun updateConsent(accepted: Boolean) {
        hasAcceptedConsent = accepted
        if (_state.value is SessionState.Error) {
            _state.value = SessionState.Idle
        }
    }

    fun startSession() {
        if (!hasAcceptedConsent) {
            _state.value = SessionState.Error("Please review and accept the sharing consent.")
            return
        }

        _state.value = SessionState.Preparing
        viewModelScope.launch {
            try {
                val session = sessionService.createSession()
                screenShareController.startSharing()
                _state.value = SessionState.Sharing(session)
            } catch (exception: Exception) {
                _state.value = SessionState.Error(exception.message ?: "Unable to start sharing.")
            }
        }
    }

    fun stopSession() {
        val current = _state.value
        if (current is SessionState.Sharing) {
            viewModelScope.launch {
                screenShareController.stopSharing()
                sessionService.stopSession(current.session)
                _state.value = SessionState.Idle
            }
        }
    }
}

class SessionViewModelFactory(
    private val sessionService: SessionService,
    private val screenShareController: ScreenShareController
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(SessionViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return SessionViewModel(sessionService, screenShareController) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
