export interface Comment {
    id: string;
    username: string;
    text: string;
};
export interface User {
    id: string;
    handle: string;
    followed: boolean;
};
export interface TextInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    style?: object;
};
export interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: object;
    textStyle?: object;
};