import Head from "next/head";
import ServerUrl from "../../lib/ServerUrl";
import "../../style/theme.scss";
import "../../style/StyleSheet.css";


interface Props {
    title?: string;
    children?: JSX.Element[] | JSX.Element;
}


const Page: React.FC<Props> = (props) => {
    return (
        <div>
            <Head>
                <title>{props.title || "WUBCO"}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="shortcut icon" type="image/ico" href={ServerUrl.get("/assets/common/blobaa.ico")} />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
            </Head>
            {props.children}
        </div>
    );
};


export default Page;