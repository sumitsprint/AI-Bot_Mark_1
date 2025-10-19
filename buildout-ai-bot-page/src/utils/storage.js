const KEY = "conversations";

export function getConversations(){
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveConversation(convo){
  const list = getConversations();
  const id = convo.id || Date.now();
  const withId = { ...convo, id };
  list.push(withId);
  localStorage.setItem(KEY, JSON.stringify(list));
  return id;
}

export function getConversationById(id){
  const list = getConversations();
  return list.find(c => String(c.id) === String(id)) || null;
}

export function clearConversations(){
  localStorage.setItem(KEY, JSON.stringify([]));
}
