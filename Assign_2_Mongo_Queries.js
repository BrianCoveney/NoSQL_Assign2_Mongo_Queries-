//
var total_num_rest = 0; 
var cuisine_name = "";
var ratio_cuisine = 0;
var borough = "";
var count_rest_boro = 0;
var count_rest_with_cuisin = 0;
var ratio_borough = 0;
//
//
//*********************************
// 1. Most popular cuisine
//*********************************
//
//---------------------------------
// 1.1. Grouping by 'restaurant_id' and get a total count of restaurants
//---------------------------------
var aggRest = db.restaurants.aggregate([
  { "$group" : { "_id" : "restaurant_id", 
                 "count_restaurants" : { "$sum" : 1 } } },
])
//
//
total_num_rest = aggRest.toArray()[0]["count_restaurants"]
//
//
//---------------------------------
// 1.2. Group the restaurants by their cuisine style, counting how many are there per group
//    - Sort the documents by decreasing order
//    - Filter the documents so as to get just the first document
//    - Use var 'total_rest' in percentage calculation
//---------------------------------
var aggRest2 = db.restaurants.aggregate([
  { "$group" : { "_id" : "$cuisine", 
                 "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 1 },
  { "$project" : { "count":1, "percentage":{ "$multiply":[{ "$divide":[100, total_num_rest]}, "$total"]}}} 
])
//
cuisine_name = aggRest2.toArray()[0]["_id"]
ratio_cuisine = aggRest2.toArray()[0]["percentage"]
print("1. The kind of cuisine with more restaurants in the city is", cuisine, "(with a", ratio_cuisine, "percentage of restaurants of the city)")
//
//
//---------------------------------
// 2. Which area represents the biggest market opportunity for opening a new restaurant of
//    this kind of cuisine? 
//---------------------------------
//
db.restaurants.aggregate([
  { "$group" : { "_id" : {"col" : "$cuisine", "bor" : "$borough"}, 
                 "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } } 
])
//
//
db.restaurants.aggregate([
  {"$group":{"_id":{"cuisine":"$American"},"count":{"$sum":1}}},
  { "$sort" : { "count" : -1 } } 
])
//
//
//*********************************
//  2. Returns the name of the borough with smaller percentage of restaurants of this kind of cuisine
//*********************************
//
//---------------------------------
// 2.1. Group the restaurants by their borough, with acount of each
//    - Sort the documents by increasing order
//    - skip the first borough named 'missing'
//    - Filter the documents so as to get just the first relevant document
//    - Use var 'total_rest' in percentage calculation
//---------------------------------
//
var aggBoro1 = db.restaurants.aggregate([
  { "$group" : { "_id" : "$borough", 
                 "count" : { "$sum" : 1 } } },
  { "$sort" : { "count" : 1 } },
  { "$skip" : 1 },
  { "$limit" : 1 },
]) 
//
count_rest_borough = aggBoro1.toArray()[0]["count"];
//
//
//---------------------------------
// 2.2. Group the restaurants by their borough, with a count of the favoirite cuisine (returned from Q1)
//    - Sort the documents by increasing order
//    - skip the first borough, as it's an outlier named 'Missing'
//    - Filter the documents so as to get just the first relevant document
//    - Use var 'ratio_borough' as our percentage calculation
//---------------------------------
var aggBoro2 = db.restaurants.aggregate([
  { "$project" : { "_id" : 0, 
                   "Borough" : "$borough", 
                   "Cuisine" : {"$cond" : [ {"$eq" : ["$cuisine", cuisine_name ] }, 1, 0]} } },
  { "$group" : { "_id" : "$Borough", "count" : { "$sum" : "$Cuisine" } } },
  { "$sort" : { "count" : 1 } },
  { "$skip" : 1 },
  { "$limit" : 1 },
  { "$project": {"count":1,"percentage":{"$multiply":[{"$divide":[100, count_rest_borough]},"$count"]}}} 
]) 
//
borough = aggBoro2.toArray()[0]["_id"];
//
ratio_borough = aggBoro2.toArray()[0]["percentage"];
//
//
print("1. The kind of cuisine with more restaurants in the city is", cuisine_name, "(with a", ratio_cuisine, "percentage of restaurants of the city)")
//
//
print ("2. The borough with smaller ratio of restaurants of this kind of cuisine is", borough, "(with a", ratio_borough, "percentage of restaurants of this kind)")
//
//
//*********************************
//  3. Zip Code
//*********************************
//
//
//---------------------------------
// 3.1. Get the biggest five zipcodes of the borough (Staten Island)
//---------------------------------
//
db.restaurants.aggregate([
  { "$match" : {  "borough" : borough}},
  { "$group" : { "_id" : 
                 "$address.zipcode", 
                 "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 5},
])
var zipcode1 = "10314" // 29.100%
var zipcode2 = "10306" // 20.869%
var zipcode3 = "10301" // 30.392%
var zipcode4 = "10305" // 19.791%
var zipcode5 = "10312" // 27.848%
var numRest = 0;
var ratioZip5 = 0;

// change the zip code variables  to one of the above, to get that zipcode's ratio
var aggBoroZip = db.restaurants.aggregate([
  { "$match" : {  "borough" : borough, "address.zipcode" : zipcode4 } },
  { "$group" : { "_id" : "$address.zipcode", "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 5},
])
numRest = aggBoroZip.toArray()[0]["total"];

var aggBoroZip2 = db.restaurants.aggregate([
  { "$match" : {  "borough" : borough, "cuisine" : cuisine_name, "address.zipcode" : zipcode4 } },
  { "$group" : { "_id" : "$address.zipcode", "total" : { "$sum" : 1 } } },
  { "$sort" : { "total" : -1 } },
  { "$limit" : 5},
  { "$project": {"count":1,"percentage":{"$multiply":[{"$divide":[100, numRest]},"$total"]}}}
])


ratioZip = aggBoroZip2.toArray()[0]["percentage"];
print(ratioZip);

print ("3. The zipcode of the borough with smaller ratio of restaurants of this kind of cuisine is zipcode =", zipcode4, "(with a", ratioZip, "percentage of restaurants of this kind)")


// 3. The zipcode of the borough with smaller ratio of restaurants of this kind of cuisine is zipcode = 10312 (with a 27.848101265822788 percentage of restaurants of this kind)


