import Button from "react-bootstrap/esm/Button";

type ActionButtonProps = {
    action: () => void;
    icon: React.ReactElement;
    title: string;
    text?: string;
}

export const ActionButton = ({ action, icon, title, text }: ActionButtonProps) => {
  return (
    <Button
      onClick={action}
      className="action-button"
      variant="outline-dark p-2 m-2"
      title={title}
    >
        {icon}
        {text}
    </Button>
  );
};
