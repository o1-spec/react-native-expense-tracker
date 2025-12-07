import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Category, Expense } from '../types';

interface MonthlyChartProps {
  expenses: Expense[];
}

const categoryColors: Record<Category, string> = {
  Food: '#FF6384',
  Transport: '#36A2EB',
  Bills: '#FFCE56',
  Shopping: '#4BC0C0',
  Subscriptions: '#9966FF',
  Others: '#FF9F40',
};

export default function MonthlyChart({ expenses }: MonthlyChartProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses.filter(
    (e) => new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear
  );

  const categoryTotals = monthlyExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<Category, number>);

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    amount,
    color: categoryColors[category as Category],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  if (chartData.length === 0) {
    return <Text>No data for this month.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending by Category</Text>
      <PieChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});