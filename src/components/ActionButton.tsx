
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
};

export default function ActionButton({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center rounded-xl px-5 py-3 ${
        secondary
          ? "border border-[#E8E7E0] bg-white"
          : "bg-[#344C3D]"
      } ${disabled ? "opacity-50" : "active:opacity-80"}`}
    >
      <Text
        className={`text-sm font-bold ${
          secondary ? "text-[#344C3D]" : "text-white"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
