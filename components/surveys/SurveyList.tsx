import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface SurveyListProps {
  title: string;
  statusFilter: string;
}

export default function SurveyList({ title, statusFilter }: SurveyListProps) {
  // ...fetch or derive data based on statusFilter...
  const dummySurveys = [
    { id: "survey1", status: statusFilter },
    { id: "survey2", status: statusFilter },
  ];
  const router = useRouter();

  return (
    <View>
      <Text>{title}</Text>
      <FlatList
        data={dummySurveys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/surveys/${item.id}`)}>
            <Text>
              {item.id} ({item.status})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
