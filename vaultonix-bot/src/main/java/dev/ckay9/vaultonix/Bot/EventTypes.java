package dev.ckay9.vaultonix.Bot;

public class EventTypes {
	public static String convertToString(EventType type) {
		switch (type) {
			case CHANNEL_UPDATE:
				return "Channel Update";
			case SERVER_UPDATE:
				return "Server Update";
			case JOIN:
				return "User Join";
			case LEAVE:
				return "User Leave";
			case MESSAGE_UPDATE:
				return "Message Update";
			default:
				return "Invalid Type";
		}
	}
}
