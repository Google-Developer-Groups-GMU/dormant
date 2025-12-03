package types

type User struct {
	ID        string `json:"id" firestore:"id"`
	Name      string `json:"name" firestore:"name"`
	Email     string `json:"email" firestore:"email"`
	AvatarURL string `json:"avatar_url" firestore:"avatar_url"`
}
