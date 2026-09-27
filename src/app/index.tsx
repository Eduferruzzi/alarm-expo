import * as Notifications from "expo-notifications"
import React, { useEffect } from "react"
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native"

// Como a notificação se comporta
Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
})

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Permissão para enviar notificação
    async function requestPermissions(): Promise<void> {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Permita as notificações para o alarme funcionar",
        )
      }
    }

    // Android precisa de criar canal para tocar som
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("alarm-channel", {
        name: "Alarme",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      })
    }
    requestPermissions()
  }, [])

  async function scheduleAlarm(secondsFromNow: number): Promise<void> {
    // Agenda para daqui X segundos
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Teste",
        body: "Remédio!!!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
        channelId: "alarm-channel", // Canal do android
      },
    })

    Alert.alert(
      "Alarme configurado!",
      `O alarme vai tocar em ${secondsFromNow} segundos`,
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Alarme Simples</Text>
      <Button
        title="Agendar Alarme (em 60 segundos)"
        onPress={() => scheduleAlarm(60)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
})
