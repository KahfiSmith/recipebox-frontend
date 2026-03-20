import type { DashboardMenuItem } from '@/features/app/types'

export const dashboardMenuItems: DashboardMenuItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    description: 'See your activity at a glance',
  },
  {
    key: 'recipes',
    label: 'Recipes',
    description: 'Keep your favorite recipes in one place',
  },
  {
    key: 'meal-planner',
    label: 'Meal Planner',
    description: 'Plan this week\'s meals',
  },
  {
    key: 'shopping-list',
    label: 'Shopping List',
    description: 'Track ingredients you need to buy',
  },
]
