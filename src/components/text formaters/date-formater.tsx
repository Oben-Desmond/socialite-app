

export function ReadableDate(props:{timestamp:number}){
    const {timestamp}= props;
    const date= ( new Date(timestamp)).toDateString()
    return <span>
        {date}
    </span>
}