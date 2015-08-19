print("Remove existing filters");

db.filters.remove({});

var access_list =  ["open", "closed"];
var platform_list = ["PS4", "XBOX", "PC"];
var game_list = ["Destiny", "Dragon Nest", "DOTA"];

print("Add new filters");

db.filters.insert({"access" : access_list, "platform" : platform_list, "game" : game_list});

