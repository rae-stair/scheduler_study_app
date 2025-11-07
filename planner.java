import java.util.*;

public class planner {
    public static void main(String[] args) {
        List<task> tasks = new ArrayList<>();
        tasks.add(new task("2025-11-06", "Math homework"));
        tasks.add(new task("2025-11-07", "Read history"));

        for (task t : tasks) {
            System.out.println(t);
        }
    }
}