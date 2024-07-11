#[derive(serde::Deserialize)]
#[serde(untagged)]
pub enum WebSocketMessage {
    Subscribe { data: BodyData },
    Heartbeat {},
}

#[derive(serde::Deserialize)]
pub struct BodyData {
    pub replay_time: String,
    pub instrument: String,
    pub exchange: String,
}
