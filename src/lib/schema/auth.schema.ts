import z from "zod";

const lobbySchema = z.object({
  room: z.string().min(1, "방 이름을 입력해주세요."),
  user: z.string().min(1, "닉네임을 입력해주세요."),
});

type LobbyFormValues = z.infer<typeof lobbySchema>; // 이거 의미 뭐지?

export { lobbySchema, type LobbyFormValues };
