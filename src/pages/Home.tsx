import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";

import "./Home.css";

const { PushNotifications } = Plugins;

const Home: React.FC = () => {
  const [deviceToken, setDeviceToken] = useState("No Device Token");

  useEffect(() => {
    const initialize = async () => {
      try {
        const { granted } = await PushNotifications.requestPermission();
        if (granted) {
          PushNotifications.register();
        } else {
          setDeviceToken("No permission granted to obtain device token.");
        }
      } catch (error) {
        setDeviceToken("Push Notification API not supported.");
      }
    };
    initialize();

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        setDeviceToken(token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      setDeviceToken("Registration error, no device token.");
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        alert("Push received: " + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        alert("Push action performed: " + JSON.stringify(notification));
      }
    );
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Push Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Push Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonListHeader>Device Token</IonListHeader>
          <IonItem>
            <IonLabel>{deviceToken}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
