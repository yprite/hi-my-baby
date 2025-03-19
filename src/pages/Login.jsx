import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChakraProvider,
  Container,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';

// 임시 사용자 데이터
const MOCK_USERS = [
  { email: 'test@test.com', password: '1234' },
  { email: 'admin@admin.com', password: 'admin' }
];

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = MOCK_USERS.find(
      user => user.email === credentials.email && user.password === credentials.password
    );

    if (user) {
      navigate('/table');
    } else {
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.sm" centerContent py={10}>
        <Box
          p={8}
          maxWidth="400px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={4} align="stretch">
            <Heading textAlign="center" mb={6}>로그인</Heading>
            
            {error && (
              <Alert status="error" borderRadius={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>이메일</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>비밀번호</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  mt={4}
                >
                  로그인
                </Button>
              </VStack>
            </form>

            <Box mt={4} p={4} bg="gray.50" borderRadius={4}>
              <Text fontSize="sm" color="gray.600">
                테스트용 계정:
              </Text>
              <Text fontSize="sm" color="gray.600">
                이메일: test@test.com
              </Text>
              <Text fontSize="sm" color="gray.600">
                비밀번호: 1234
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default Login; 