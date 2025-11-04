import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Linking, 
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Support'>;

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
};

const initialFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'Làm sao đặt lịch bảo dưỡng?',
    answer: 'Bạn có thể đặt lịch bảo dưỡng bằng cách vào mục "Lịch hẹn" và chọn "Đặt lịch mới". Điền đầy đủ thông tin và chọn thời gian phù hợp.',
    expanded: false,
  },
  {
    id: '2',
    question: 'Sạc nhanh khác sạc thường như thế nào?',
    answer: 'Sạc nhanh (DC Fast Charging) có thể sạc pin từ 20% lên 80% trong khoảng 30-40 phút, trong khi sạc thường (AC) mất từ 4-8 giờ để sạc đầy.',
    expanded: false,
  },
  {
    id: '3',
    question: 'Kiểm tra tình trạng pin ở đâu?',
    answer: 'Bạn có thể kiểm tra tình trạng pin trong mục "Xe của tôi". Tại đây sẽ hiển thị mức pin hiện tại và tầm hoạt động ước tính.',
    expanded: false,
  },
  {
    id: '4',
    question: 'Làm thế nào để tìm trạm sạc gần nhất?',
    answer: 'Mở ứng dụng và vào mục "Bản đồ". Ứng dụng sẽ tự động hiển thị các trạm sạc gần vị trí của bạn cùng với thông tin chi tiết về từng trạm.',
    expanded: false,
  },
  {
    id: '5',
    question: 'Cách thanh toán phí sạc?',
    answer: 'Bạn có thể thanh toán trực tiếp tại trạm sạc bằng thẻ ngân hàng, ví điện tử hoặc liên kết với tài khoản ứng dụng để thanh toán tự động.',
    expanded: false,
  },
];

export default function SupportScreen() {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [message, setMessage] = useState('');
  const navigation = useNavigation<SupportScreenNavigationProp>();

  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };

  const handleCallSupport = () => {
    const phoneNumber = '19001234';
    const url = Platform.OS === 'android' 
      ? `tel:${phoneNumber}` 
      : `telprompt:${phoneNumber}`;
    
    Linking.openURL(url).catch(err => {
      Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi');
      console.error('Error making call:', err);
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send this to your backend
      Alert.alert('Thành công', 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm nhất có thể!');
      setMessage('');
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung tin nhắn');
    }
  };

  const openEmail = () => {
    const email = 'support@evcharge.vn';
    const subject = 'Yêu cầu hỗ trợ';
    const body = 'Xin chào bộ phận hỗ trợ,\n\nTôi cần hỗ trợ về:';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Trung tâm hỗ trợ</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons 
                    name={faq.expanded ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#6c757d" 
                  />
                </TouchableOpacity>
                {faq.expanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gửi yêu cầu hỗ trợ</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              Bạn có câu hỏi hoặc cần hỗ trợ? Hãy gửi tin nhắn cho chúng tôi, đội ngũ hỗ trợ sẽ liên hệ với bạn sớm nhất có thể.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Mô tả vấn đề của bạn..."
              placeholderTextColor="#adb5bd"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
            />
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Ionicons name="send" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.sendButtonText}>Gửi tin nhắn</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ trực tiếp</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity 
              style={styles.contactMethod}
              onPress={handleCallSupport}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="call" size={20} color="#1e88e5" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Gọi điện thoại</Text>
                <Text style={styles.contactValue}>1900 1234</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#adb5bd" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.contactMethod}
              onPress={openEmail}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#e8f5e9' }]}>
                <Ionicons name="mail" size={20} color="#43a047" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Gửi email</Text>
                <Text style={styles.contactValue}>support@evcharge.vn</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#adb5bd" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.contactMethod}
              onPress={() => {
                // In a real app, you would open a chat screen
                Alert.alert('Thông báo', 'Tính năng chat trực tuyến sẽ sớm có mặt!');
              }}
            >
              <View style={[styles.contactIcon, { backgroundColor: '#f3e5f5' }]}>
                <Ionicons name="chatbubbles" size={20} color="#8e24aa" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Chat trực tuyến</Text>
                <Text style={styles.contactValue}>Đang trực tuyến</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#adb5bd" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 EV Charge. Tất cả các quyền được bảo lưu.</Text>
          <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 16,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3436',
    marginRight: 12,
  },
  faqAnswer: {
    padding: 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#636e72',
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactText: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sendButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: '#6c757d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f2f6',
    marginLeft: 52,
  },
  footer: {
    marginTop: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 4,
  },
});


