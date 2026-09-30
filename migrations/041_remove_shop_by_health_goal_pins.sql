-- 041: Remove legacy homepage_shop_by_goal pins (superseded by health_goals_content)
DELETE FROM content_pins WHERE group_key IN ('homepage_shop_by_goal', 'shop_by_health_goal', 'shop_by_goal');
