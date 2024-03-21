import Button from "react-bootstrap/esm/Button";
import "./styles.css";

type ActionButtonProps = {
  action: () => void;
  icon: React.ReactElement;
  title: string;
  text?: string;
};

export const ActionButton = ({
  action,
  icon,
  title,
  text,
}: ActionButtonProps) => {
  return (
    <Button
      onClick={action}
      className="action-button"
      variant="outline-dark p-1"
      title={title}
    >
      {icon}
      {text}
    </Button>
  );
};
