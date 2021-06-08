import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

import { myFriends } from "../schema/resolvers";

const GENDER_ENUM = new GraphQLEnumType({
  name: "GENDER",
  values: {
    MALE: {
      value: "MALE",
    },
    FEMALE: {
      value: "FEMALE",
    },
    OTHERS: {
      value: "OTHERS",
    },
  },
});

const ISFR_SCHEMA = new GraphQLObjectType({
  name: "ISFR_SCHEMA",
  description: "This is for friends schema",
  fields: () => ({
    name: { type: GraphQLString },
    isFriend: { type: GraphQLBoolean },
    gender: { type: GENDER_ENUM },
  }),
});

const ISFR_INPUT = new GraphQLInputObjectType({
  name: "isFriend_input",
  description: "input type for is-friend",
  fields: () => ({
    name: { type: GraphQLString },
    isFriend: { type: GraphQLBoolean },
    gender: { type: GENDER_ENUM },
  }),
});

const FRIENDBOOL_INPUT = new GraphQLInputObjectType({
    name: "friendBool_input",
  description: "input type for is-friend",
  fields: () => ({
    friendBool: { type: GraphQLBoolean },
  }),
})

const FRIEND_INPUT = new GraphQLInputObjectType({
  name: "friend_input",
  description: "this is an input type for add friend",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    isFriend: { type: new GraphQLList(ISFR_INPUT) },
  }),
});

const FRIENDSSchema = new GraphQLObjectType({
  name: "FRIENDS",
  description: "This is the friends description",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    isFriend: { type: new GraphQLList(ISFR_SCHEMA) },
  }),
});

const QuerySchema = new GraphQLObjectType({
  name: "Query",
  description: "main query schema",
  fields: () => ({
    friends: {
      type: new GraphQLList(FRIENDSSchema),
      resolve() {
        return myFriends;
      },
    },
    isMyFriend: {
        type: new GraphQLList(ISFR_SCHEMA),
        args: { 
            friendBool: { 
                type: new GraphQLNonNull(GraphQLBoolean)
            },
            id: { type: new GraphQLNonNull(GraphQLInt)}
        },
        resolve(_parents, { friendBool, id}) {
            id = id - 1
            const friends = myFriends[id].isFriend.filter((is) => is.isFriend === friendBool)
            return friends
        }
    }
  }),
});

const MutationSchema = new GraphQLObjectType({
  name: "MutationSchema",
  description: "mutations for friends",
  fields: () => ({
    addFriend: {
      type: new GraphQLList(FRIENDSSchema),
      args: {
        input: {
          type: FRIEND_INPUT,
        },
      },
      resolve(_, { input }: Record<string, any>) {
        myFriends.push(JSON.parse(JSON.stringify(input)));
        console.log(myFriends)
        return myFriends;
      },
    },
  }),
});

export default new GraphQLSchema({
  query: QuerySchema,
  mutation: MutationSchema,
});
