print("Remove existing filters");

db.filters.remove({});

var access_list =  ["open", "closed"];
var platform_list = ["PS4", "XBOX One", "PC", "PS3", "XBOX 360", "Wii"];
var game_list = ["Destiny", "Dragon Nest", "DOTA", "CoD", "Ragnarok", "Ragnarok 2"];

print("Add new filters");

db.filters.insert({"access" : access_list, "platform" : platform_list, "game" : game_list});
