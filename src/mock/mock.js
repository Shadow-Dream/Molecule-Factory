import Mock from 'mockjs';

Mock.mock('/api/reactiongraph/analyze', 'post', (options) => {
  const requestBody = JSON.parse(options.body);
  console.log(requestBody);
  return {
    code: 200,
    message: 'success',
    data: {taskId: 'mock_task_2'},
  };
});

Mock.mock(/\/api\/reactiongraph\/poll\/.*/, 'get', (options) => {
  const urlParts = options.url.split('/');
  const taskId = urlParts[urlParts.length - 1]; // 获取最后的 taskId

  if (taskId === 'mock_task_1') {
    return {
      status: 'completed',
      result: {
        task_id: taskId,
        reactants: ['H2', 'O2'],
        products: ['H2O'],
        description: 'Reaction completed successfully.',
      },
    };
  } else if (taskId === 'mock_task_2') {
    return {
      status: 'in_progress',
      result: null,
    };
  } else {
    return {
      status: 'not_found',
      error: 'Task ID not found',
    };
  }
});

console.log('Mock.js is running...');
