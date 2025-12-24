package com.example.parentassist

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.background
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Composable
fun RootScreen(viewModel: SessionViewModel) {
    val state by viewModel.state.collectAsState()
    when (val current = state) {
        is SessionState.Sharing -> SharingScreen(session = current.session, onStop = viewModel::stopSession)
        else -> StartScreen(state = state, viewModel = viewModel)
    }
}

@Composable
private fun StartScreen(state: SessionState, viewModel: SessionViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text(
            text = "Need Help?",
            style = MaterialTheme.typography.headlineLarge,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )

        Text(
            text = "Start a live help session to share your screen with a trusted helper.",
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.secondary,
            modifier = Modifier.fillMaxWidth()
        )

        ConsentCard(hasAccepted = viewModel.hasAcceptedConsent, onToggle = viewModel::updateConsent)

        if (state is SessionState.Error) {
            Text(
                text = state.message,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium
            )
        }

        Button(
            onClick = viewModel::startSession,
            enabled = viewModel.hasAcceptedConsent && state !is SessionState.Preparing,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = if (state is SessionState.Preparing) "Starting..." else "Start Help Session")
        }

        Spacer(modifier = Modifier.weight(1f))
    }
}

@Composable
private fun ConsentCard(hasAccepted: Boolean, onToggle: (Boolean) -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(text = "Before you share", style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Your helper will see your screen live. You can stop sharing at any time.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.secondary
        )
        Spacer(modifier = Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked = hasAccepted, onCheckedChange = onToggle)
            Text(text = "I understand and agree to share my screen")
        }
    }
}

@Composable
private fun SharingScreen(session: ShareSession, onStop: () -> Unit) {
    val formatter = DateTimeFormatter.ofPattern("h:mm a")
        .withZone(ZoneId.systemDefault())

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "LIVE",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .padding(horizontal = 12.dp, vertical = 6.dp)
                    .background(Color.Red, RectangleShape)
            )
        }

        Text(
            text = "You are sharing your screen",
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Join code", style = MaterialTheme.typography.titleMedium)
            Text(text = session.joinCode, fontSize = 36.sp, fontWeight = FontWeight.Bold)
            Text(
                text = "Expires at ${formatter.format(session.expiresAt)}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.secondary
            )
        }

        Button(
            onClick = onStop,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Stop Sharing")
        }

        Spacer(modifier = Modifier.weight(1f))
    }
}
