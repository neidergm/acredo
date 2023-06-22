import { useRef } from 'react'

type T_Props = {
    maxHeight?: number;
}

const useAutoGrowField = ({ maxHeight = 120 }: T_Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const resizeTextArea = () => {
        if (textAreaRef?.current) {
            if (textAreaRef.current.scrollHeight > maxHeight) {
                return false;
            }
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 5 + "px";
        }
    };

    const getHTMLValue = () => {
        const text_input = textAreaRef.current?.value.trim();
        let output_html = "";
        if (text_input && text_input.length > 0) {
            output_html += "<p>"; //begin by creating paragraph
            for (let counter = 0; counter < text_input.length; counter++) {
                switch (text_input[counter]) {
                    case '\n':
                        output_html += "<br/>";
                        break;

                    case ' ':
                        if (text_input[counter - 1] != ' ' && text_input[counter - 1] != '\t')
                            output_html += " ";
                        break;

                    case '\t':
                        if (text_input[counter - 1] != '\t')
                            output_html += " ";
                        break;

                    case '&':
                        output_html += "&amp;";
                        break;

                    case '"':
                        output_html += "&quot;";
                        break;

                    case '>':
                        output_html += "&gt;";
                        break;

                    case '<':
                        output_html += "&lt;";
                        break;

                    default:
                        output_html += text_input[counter];

                }
            }
            output_html += "</p>";
        }

        return output_html;
    }

    return (
        {
            reset: (value = "") => {
                if (textAreaRef.current) {
                    textAreaRef.current.value = value;
                    textAreaRef.current.style.height = "auto";
                }
            },
            getHTMLValue,
            onInput: () => resizeTextArea(),
            ref: textAreaRef
        }
    )
}

export default useAutoGrowField;
