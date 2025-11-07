public class task {
    public String date;
    public String title;

    public task(String date, String title) {
        this.date = date;
        this.title = title;
    }

    public String toString() {
        return date + ": " + title;
    }
}
