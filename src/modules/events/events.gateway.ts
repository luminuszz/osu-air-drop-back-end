import { JwtService } from "@nestjs/jwt";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { UserTokenDecoded } from "../auth/dto";

@WebSocketGateway({
	namespace: "events",
	cors: { origin: "*" },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	constructor(private readonly jwtService: JwtService) {}

	async handleConnection(client: Socket) {
		try {
			const jwtToken = client.handshake.auth.token as string;

			const decoded =
				await this.jwtService.verifyAsync<UserTokenDecoded>(jwtToken);

			client.join(decoded.id);

			console.log(`Dispositivo conectado e adicionado à sala: ${decoded.id}`);
		} catch (e) {
			console.log(e);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Dispositivo desconectado: ${client.id}`);
	}

	notifyNewFileUploaded(userId: string, fileId: string) {
		console.log({ userId, fileId });
		this.server.to(userId).emit("new_file_uploaded", { fileId });
	}

	notifyNewDevicePaired(userId: string, deviceName: string) {
		this.server.to(userId).emit("new_device_paired", { deviceName });
	}
}
